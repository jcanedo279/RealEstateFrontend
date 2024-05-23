import { createTheme } from '@mui/material/styles';


// Define color variables
const colors = {
    white: '#ffffff',
    black: '#000000',
    primaryRedLighter: '#fd2e2e',
    primaryRed: '#ee0202',
    primaryRedDarker: '#c70202',
    secondaryBlue: '#02eeee',
    errorRed: '#b00020',
    warningOrange: '#ee7802',
    infoYellow: '#eeee02',
    successGreen: '#02ee02',
    backgroundPaper: '#f5f5f5',
    backgroundSkyBlue: '#dbfffe',
};

const defaultTheme = createTheme({
    palette: {
        primary: {
            light: colors.primaryRedLighter,
            main: colors.primaryRed,
            dark: colors.primaryRedDarker,
        },
        secondary: {
            main: colors.secondaryBlue,
        },
        error: {
            main: colors.errorRed,
        },
        warning: {
            main: colors.warningOrange,
        },
        info: {
            main: colors.infoYellow,
        },
        success: {
            main: colors.successGreen,
        },
        background: {
            default: colors.white,
            paper: colors.backgroundPaper,
            primary: colors.backgroundSkyBlue,
        },
        text: {
            primary: colors.black,
            secondary: colors.white,
        },
    },
    typography: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 14,
        h1: {
            fontSize: 48,
            fontWeight: 700,
        },
        h2: {
            fontSize: 36,
            fontWeight: 700,
        },
        h3: {
            fontSize: 28,
            fontWeight: 700,
        },
        h4: {
            fontSize: 24,
            fontWeight: 700,
        },
        h5: {
            fontSize: 20,
            fontWeight: 700,
        },
        h6: {
            fontSize: 18,
            fontWeight: 500,
        },
        body1: {
             fontSize: 14,
        },
        body2: {
            fontSize: 12,
        },
        subtitle1: {
            fontSize: 16,
            fontWeight: 600,
        },
        caption: {
            fontSize: 12,
        },
        button: {
            fontSize: 14,
            fontWeight: 500,
        },
    },
    spacing: 8, // Default spacing multiplier (1 unit = 8px)
    spacingFactor: {
        half: 2,
        single: 4,
        double: 8
    },
    breakpoints: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
    },
    borderRadius: {
        single: 16,
        half: 8,
        quarter: 4,
    },
    components: {
        MuiListItem: {
            styleOverrides: {
                root: {
                    color: colors.black,
                    '&:hover': {
                        backgroundColor: colors.primaryRed,
                        color: colors.white,
                        '& .MuiListItemIcon-root': {
                            color: colors.white,
                        },
                    },
                    '&:focus': {
                        backgroundColor: colors.primaryRed,
                        color: colors.white,
                        '& .MuiListItemIcon-root': {
                            color: colors.white,
                        },
                    },
                    '& .MuiListItemIcon-root': {
                        color: colors.black,
                        '&:hover': {
                            color: colors.white,
                        },
                        '&:focus': {
                            color: colors.white,
                        },
                    },
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    fontWeight: 'bold',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primaryRed,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primaryRed,
                    },
                },
                notchedOutline: {
                    borderColor: colors.primaryRed,
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    '&.Mui-focused': {
                        color: colors.primaryRed,
                    },
                },
            },
        },
    },
});

export default defaultTheme;
