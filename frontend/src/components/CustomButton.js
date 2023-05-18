import { Button, styled } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";



const CustomButton = (
    {
    backgroundColor,
    color,
    buttonText,
    heroBtn,
    guideBtn,
    getStartedBtn,
    val
    }) => {
    
    let navigate = useNavigate();
    function clickhandler(a) {
        if (a === "Register") navigate('/signup');
    }

    const CustomButton = styled(Button)(({ theme }) => ({
        backgroundColor: backgroundColor,
        color: color,
        fontWeight: "700",
        fontSize: "14px",
        cursor: "pointer",
        padding: "0.5rem 1.25rem",
        borderRadius: "7px",
        textTransform: "none",
        display: "block",
        border: "2px solid transparent",
        "&:hover": {
            backgroundColor: color,
            color: backgroundColor,
            borderColor: backgroundColor,
        },
        [theme.breakpoints.down("md")]: {
            margin: (heroBtn || getStartedBtn) && theme.spacing(0, "auto", 3, "auto"),
            width: (heroBtn || getStartedBtn) && "90%",
        },
        [theme.breakpoints.down("sm")]: {
            marginTop: guideBtn && theme.spacing(3),
            width: guideBtn && "90%",
        },
    }));

    return <CustomButton onClick={()=> clickhandler(val)}>{buttonText}</CustomButton>;
};

export default CustomButton;
