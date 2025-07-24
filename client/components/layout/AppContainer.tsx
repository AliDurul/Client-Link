"use client";
import { PropsWithChildren, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectThemeConfig, toggleAnimation, toggleLayout, toggleMenu, toggleNavbar, toggleRTL, toggleSemidark, toggleTheme } from "@/lib/features/theme/themeSlice";

function AppContainer({ children }: PropsWithChildren) {

    const themeConfig = useAppSelector(selectThemeConfig)
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
        dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
        dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
        dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
        dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
        dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
        dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));

    }, [dispatch, themeConfig.theme, themeConfig.menu, themeConfig.layout, themeConfig.rtlClass, themeConfig.animation, themeConfig.navbar, themeConfig.semidark]);

    return (
        <div // main-section
            className={`${(themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${themeConfig.rtlClass}  relative font-nunito text-sm font-normal antialiased`}>
            {children}
        </div>
    );
}

export default AppContainer;
