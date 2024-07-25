import React, { useEffect, useState, useCallback, useRef } from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import { useAuth } from '../util/AuthContext';
import { Typography, Card, Box } from '@mui/material';

const DistributionPlot = ({ graphFormData, propertyData, isFetching, setIsFetching }) => {
  const [data, setData] = useState(null);
  const { fetchBackendApiWithContext } = useAuth();
  const previousFormData = useRef(null);
  // Toggle-able reference lines.
  const [showReferenceLine, setShowReferenceLine] = useState(true);
  const [traceVisibility, setTraceVisibility] = useState({
    'Property Value': true,
    'Mean': true,
    'IQR1': true,
    'IQR3': true
  });

  const fetchData = useCallback(async () => {
    if (!graphFormData || JSON.stringify(previousFormData.current) === JSON.stringify(graphFormData)) {
      console.log('FormData has not changed or is invalid. Skipping fetch.');
      setIsFetching(false);
      return;
    }
    previousFormData.current = graphFormData;
    console.log('Fetching data with formData:', graphFormData);
    try {
      const result = await fetchBackendApiWithContext('/distribution_graph_data', {
        method: 'POST',
        data: JSON.stringify({ ...graphFormData, propertyData }),
      });
      console.log('Fetched data:', result);
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsFetching(false); // Set isFetching to false after fetching data
    }
  }, [graphFormData, propertyData, setIsFetching]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isFetching || !data) {
    return <div>Loading...</div>;
  }

  const { histogram_data, kde_data, annotations, percentiles } = data;

  if (!histogram_data || !kde_data || !annotations || !percentiles) {
    console.error('Invalid data structure:', data);
    return <div>Error: Invalid data structure</div>;
  }

  const adjustValueWithinDomain = (value, domain) => {
    return Math.max(domain[0], Math.min(domain[1], value));
  };

  const createReferenceLine = (value, name, color, dash, showLine, xDomain, yDomain, axis = 'x') => {
    if (!showLine) return null;
  
    const adjustedValue = adjustValueWithinDomain(value, axis === 'x' ? xDomain : yDomain);
    let xPoints, yPoints;
  
    if (axis === 'x') {
      // Create continuous points along the Y-axis
      xPoints = Array(100).fill(adjustedValue);
      yPoints = Array.from({length: 100}, (_, i) => yDomain[0] + (yDomain[1] - yDomain[0]) * i / 99);
    } else {
      // Create continuous points along the X-axis
      xPoints = Array.from({length: 100}, (_, i) => xDomain[0] + (xDomain[1] - xDomain[0]) * i / 99);
      yPoints = Array(100).fill(adjustedValue);
    }
  
    // Scatter trace that mimics a line for full hover interaction
    const lineTrace = {
        x: xPoints,
        y: yPoints,
        mode: 'lines', // Create a line
        type: 'scatter',
        hoverinfo: 'text',
        text: `${name}: ${adjustedValue.toFixed(2)}`,
        line: { color, dash, width: 2 },
        showlegend: false
    };
  
    return lineTrace;
  };

  // Modify the visibility based on legend click
  const handleLegendClick = (e) => {
    const traceName = e.data[e.curveNumber].name;
    if (traceVisibility.hasOwnProperty(traceName)) {
      // Toggle the visibility state
      setTraceVisibility(prev => ({
        ...prev,
        [traceName]: !prev[traceName]
      }));
      return false; // Suppress default behavior
    }
    return true;
  };

  const render1DChart = (metric) => {
    console.log('Rendering 1D Chart for metric:', metric);

    if (!histogram_data[metric] || !kde_data[metric]) {
      console.error(`Error: Data for ${metric} not found.`);
      return <div>Error: Data for {metric} not found.</div>;
    }

    const propertyValue = propertyData && !isNaN(propertyData[metric]) ? Number(propertyData[metric]) : null;
    console.log(`Property value for ${metric}:`, propertyValue);
    console.log(`Type of property value for ${metric}:`, typeof propertyValue);

    const xValues = histogram_data[metric].map(point => point.x);
    const xDomain = [Math.min(...xValues), Math.max(...xValues)];
    const yDomain = [0, Math.max(...histogram_data[metric].map(d => d.count), ...kde_data[metric].map(d => d.y))];
    console.log(`xDomain for ${metric}:`, xDomain);

    const percentile = percentiles && percentiles[metric] ? percentiles[metric] : null;
    console.log(`Percentile for ${metric}:`, percentile);

    // Initial plot data setup for the histogram and KDE plot
    const plot_data = [
      {
        x: histogram_data[metric].map(d => d.x),
        y: histogram_data[metric].map(d => d.count),
        type: 'bar',
        name: 'Count',
        marker: { color: 'gray' },
        hovertemplate: `<b>${metric}</b>: %{x}<br><b>Count</b>: %{y}<extra></extra>`,
      },
      {
        x: kde_data[metric].map(d => d.x),
        y: kde_data[metric].map(d => d.y),
        type: 'scatter',
        mode: 'lines',
        name: 'Density',
        line: { color: 'orange' },
        yaxis: 'y2',
      }
    ];

    const layout = {
      xaxis: { title: metric, range: xDomain },
      yaxis: { title: 'Count', automargin: true },
      yaxis2: {
        title: 'Density',
        overlaying: 'y',
        side: 'right',
        automargin: true,
      },
      annotations: [],
      legend: {
        orientation: 'h',
        x: 0.5,
        xanchor: 'center',
        y: -0.25, // Adjust this value to move the legend lower if necessary
        yanchor: 'top'
      },
      margin: {
        l: 70,
        r: 70,
        t: 50,
        b: 75
      },
      shapes: []
    };

    // Process each reference line type
    ['Property Value', 'Mean', 'IQR1', 'IQR3'].forEach((lineType, index) => {
      const value = [propertyValue, annotations[metric]?.mean, annotations[metric]?.iqr1, annotations[metric]?.iqr3][index];
      if (value !== null) {
          const lineColor = ['red', 'green', 'blue', 'purple'][index];
          const lineDash = ['dash', 'dot', 'dot', 'dot'][index];
          const lineTrace = createReferenceLine(value, lineType, lineColor, lineDash, true, xDomain, yDomain, 'x');
          plot_data.push(lineTrace);
      }
    });

    return (
      <Plot
        key={`plot-${metric}`}  // Add a unique key for Plot to force re-render
        data={plot_data}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true }}
        // onLegendClick={onLegendClick={handleLegendClick}}
      />
    );
  };

  const render2DChart = (metricX, metricY) => {
    console.log(`Rendering 2D Chart for metrics: ${metricX} vs ${metricY}`);

    if (!histogram_data[metricX] || !histogram_data[metricY] || !kde_data[metricX] || !kde_data[metricY]) {
      console.error(`Error: Data for ${metricX} or ${metricY} not found.`);
      return <div>Error: Data for {metricX} or {metricY} not found.</div>;
    }

    const xData = histogram_data[metricX];
    const yData = histogram_data[metricY];
    const xValues = xData.map(point => point.x);
    const yValues = yData.map(point => point.x);
    const xCounts = xData.map(point => point.count);
    const yCounts = yData.map(point => point.count);
    const xKdeValues = kde_data[metricX].map(point => point.x);
    const yKdeValues = kde_data[metricY].map(point => point.x);
    const xKdeDensity = kde_data[metricX].map(point => point.y);
    const yKdeDensity = kde_data[metricY].map(point => point.y);

    const xDomain = [Math.min(...xValues), Math.max(...xValues)];
    const yDomain = [Math.min(...yValues), Math.max(...yValues)];

    const heatmapData = {
      x: xValues,
      y: yValues,
      z: [],
      type: 'heatmap',
      colorscale: 'Viridis',
      name: `${metricX} vs. ${metricY} Heatmap`,
      hovertemplate: `<b>${metricX}:%{x}<br>${metricY}:%{y}<br>Count:%{z}</b>`,
    };

    const heatmapCounts = Array(xValues.length).fill(0).map(() => Array(yValues.length).fill(0));

    for (let i = 0; i < xValues.length; i++) {
      for (let j = 0; j < yValues.length; j++) {
        heatmapCounts[i][j] = xCounts[i] + yCounts[j];
      }
    }

    heatmapData.z = heatmapCounts;

    // Prepare plot data array, starting with the heatmap data
    const plot_data = [
      heatmapData,
      {
        x: xValues,
        y: xCounts,
        type: 'bar',
        xaxis: 'x',
        yaxis: 'y2',
        marker: { color: 'gray' },
        name: `${metricX} Histogram`,
        hovertemplate: `<b>${metricX}:%{x}<br>Count:%{y}</b>`,
      },
      {
        x: yCounts,
        y: yValues,
        type: 'bar',
        xaxis: 'x2',
        yaxis: 'y',
        orientation: 'h',
        marker: { color: 'gray' },
        name: `${metricY} Histogram`,
        hovertemplate: `<b>${metricY}:%{y}<br>Count:%{x}</b>`,
      },
      {
        x: xKdeValues,
        y: xKdeDensity,
        type: 'scatter',
        mode: 'lines',
        xaxis: 'x',
        yaxis: 'y2',
        line: { color: 'orange' },
        name: `${metricX} KDE`,
        hovertemplate: `<b>${metricX}:%{x}<br>Density:%{y}</b>`,
      },
      {
        x: yKdeDensity,
        y: yKdeValues,
        type: 'scatter',
        mode: 'lines',
        orientation: 'h',
        xaxis: 'x2',
        yaxis: 'y',
        line: { color: 'orange' },
        name: `${metricY} KDE`,
        hovertemplate: `<b>${metricY}:%{y}<br>Density:%{x}</b>`,
      },
    ];

    // Process reference lines for both X and Y axes
    ['x', 'y'].forEach(axis => {
        const value = axis === 'x' ? propertyData[metricX] : propertyData[metricY];
        const annotationsData = annotations[axis === 'x' ? metricX : metricY];

        if (value !== null) {
            plot_data.push(createReferenceLine(value, `Property ${axis.toUpperCase()} Value`, 'red', 'dash', showReferenceLine, xDomain, yDomain, axis));
        }
        if (annotationsData) {
            ['mean', 'iqr1', 'iqr3'].forEach((stat, index) => {
                const statValue = annotationsData[stat];
                const lineColor = ['green', 'blue', 'purple'][index];
                const lineDash = ['dot', 'dot', 'dot'][index];
                if (statValue !== undefined) {
                    plot_data.push(createReferenceLine(statValue, `${stat.toUpperCase()} ${axis.toUpperCase()}`, lineColor, lineDash, true, xDomain, yDomain, axis));
                }
            });
        }
    });

    const layout = {
      title: `${metricX} vs ${metricY} Distribution`,
      xaxis: {
          title: metricX,
          domain: [0, 0.85], // Adjust domain to prevent overlap if adding side histograms
          range: xDomain
      },
      yaxis: {
          title: metricY,
          domain: [0, 0.85], // Adjust domain to prevent overlap if adding side histograms
          range: yDomain
      },
      xaxis2: {
          domain: [0.85, 1],
          showgrid: false
      },
      yaxis2: {
          domain: [0.85, 1],
          showgrid: false
      },
      margin: {
        l: 70,  // Left margin
        r: 70,  // Right margin
        t: 50,  // Top margin
        b: 40   // Reduce bottom margin to reduce space
      },
      width: 1000,
      height: 1000,
      showlegend: true,
      legend: {
        orientation: 'h',
        x: 0.5,
        xanchor: 'center',
        y: -0.1,  // Adjust this closer to 0 to move it up towards the plot area
        yanchor: 'top'
      },
      grid: {
          rows: 2,
          columns: 2,
          subplots: [['xy', 'x2y'], ['xy', 'y2']],
          roworder: 'bottom to top'
      }
    };

    return (
      <Plot
        data={plot_data}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true }}
        onLegendClick={handleLegendClick}
      />
    );
  };

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom>
        {graphFormData.visualizeOptions.length === 1 && `${graphFormData.visualizeOptions[0]} Distribution`}
      </Typography>

      {annotations && (
        <Card variant="outlined" style={{ padding: '10px' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
            {graphFormData.visualizeOptions.map((metric) => (
              <Box key={metric} sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
                <Typography variant="body1">Metric: {metric}</Typography>
                {annotations[metric] ? (
                  <>
                    <Typography variant="body1">Standard Deviation: {annotations[metric].std_dev.toFixed(2)}</Typography>
                    <Typography variant="body1">Median: {annotations[metric].median.toFixed(2)}</Typography>
                    <Typography variant="body1">Kurtosis: {annotations[metric].kurtosis.toFixed(2)}</Typography>
                    <Typography variant="body1">Skewness: {annotations[metric].skewness.toFixed(2)}</Typography>
                  </>
                ) : (
                  <Typography variant="body1">Error: No annotation data for {metric}</Typography>
                )}
              </Box>
            ))}
          </Box>
        </Card>
      )}

      {graphFormData.visualizeOptions.length === 1 && !isFetching && render1DChart(graphFormData.visualizeOptions[0])}
      {graphFormData.visualizeOptions.length === 2 && !isFetching && render2DChart(graphFormData.visualizeOptions[0], graphFormData.visualizeOptions[1])}
    </Box>
  );
};

DistributionPlot.propTypes = {
  graphFormData: PropTypes.object.isRequired,
  propertyData: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  setIsFetching: PropTypes.func.isRequired,
};

export default DistributionPlot;
