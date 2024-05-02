import analyzeStyle from '../../analyze/analyze.style';

const HandleTheme = (isDarkMode) => {
    let textColor = 'black';
    let backgroundColor = 'white';
    let borderColor = 'black';
    

    if (isDarkMode) {
        textColor = 'white';
        backgroundColor = 'black';
        borderColor = 'white';
    }

    console.log('isDarkMode: ', isDarkMode);
    console.log('textColor: ', textColor);
    console.log('backgroundColor: ', backgroundColor);
    console.log('borderColor: ', borderColor);
    
    return analyzeStyle(textColor, backgroundColor, borderColor);

}

export default HandleTheme;
