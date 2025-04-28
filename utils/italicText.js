import React from "react"
import { Text as RNText } from "react-native"
import { useTheme } from "react-native-paper"

// this is a custom text component that uses the theme from react-native-paper
// it is used to enable the use of italic text in the app, which is not supported by default in react-native-paper

export default function ItalicText({ children, style, variant = "bodyMedium", ...rest }) {
    const theme = useTheme()
    const variantStyle = theme.fonts[variant] || theme.fonts.bodyMedium

    return (
        <RNText
            style={[
                {
                    fontStyle: "italic",
                    color: theme.colors.onBackground,
                    fontSize: variantStyle.fontSize,
                    lineHeight: variantStyle.lineHeight,
                    fontWeight: variantStyle.fontWeight,
                    letterSpacing: variantStyle.letterSpacing,
                    textAlign: variantStyle.textAlign,
                    textTransform: variantStyle.textTransform,
                },
                style,
            ]}
            {...rest}
        >
            {children}
        </RNText>
    )
}