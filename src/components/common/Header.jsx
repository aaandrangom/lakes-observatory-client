// Header.js
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import UTNLetters from '/images/letters.png';
import { FaUserCircle, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useTranslatedLinks } from '../../assets/options/data.js';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import LanguageSelector from './LanguageSelector.jsx';

const Header = () => {
    const [open, setOpen] = useState(false);
    const { isAuthenticated, isAdmin, logoutAction } = useAuth();
    const { t, i18n } = useTranslation();

    const handleMenuClick = useCallback(() => {
        setOpen(prevOpen => !prevOpen);
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        toast.promise(
            (async () => {
                const response = await logoutAction();
                if (response.status === 200) {
                    return response.data?.msg;
                }
                throw new Error(response.data?.details);
            })(),
            {
                loading: 'Cerrando sesión...',
                success: (msg) => `${msg}!`,
                error: (err) => `${err.message}`,
            }
        );
    };

    const changeLanguage = useCallback((selectedOption) => {
        i18n.changeLanguage(selectedOption.value);
    }, [i18n]);

    const { LinkData } = useTranslatedLinks();

    const links = useMemo(() => LinkData.map(link => ({
        ...link,
        title: t(link.title),
    })), [t]);

    const filteredLinks = isAdmin
        ? links
        : links.filter(link => link.title !== t("administration"));

    if (!i18n.isInitialized) {
        return null;
    }

    return (
        <header className="bg-red-600 py-4 text-white sticky z-50 shadow-md top-0 left-0 w-full">
            <div className="container flex justify-between items-center">
                <div className="logo flex items-center gap-6">
                    <img src={UTNLetters} alt="Logo" className="h-10" />
                </div>

                <nav className={open ? "mobile-view" : "desktop-view"}>
                    <ul className="flex justify-center items-center gap-6">
                        {filteredLinks.map((link) => (
                            <li key={link.id} onClick={() => setOpen(false)}>
                                <Link
                                    className="text-[15px] text-white hover:text-gray-300"
                                    to={link.url}
                                    aria-label={t(`${link.title}`)}
                                >
                                    {t(`${link.title}`)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to='/profile'
                                className="bg-transparent hover:bg-gray-200 text-white hover:text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1"
                                aria-label={t('profile')}
                            >
                                <FaUserCircle size={20} />
                                <span className="text-sm">{t('profile')}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-transparent hover:bg-gray-200 text-white hover:text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1"
                                aria-label={t('logout')}
                            >
                                <FaSignOutAlt size={20} />
                                <span className="text-sm">{t('logout')}</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to='/sign-in'
                                className="bg-transparent hover:bg-gray-200 text-white hover:text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1"
                                aria-label={t('sign-in')}
                            >
                                <FaUserCircle size={20} />
                                <span className="text-sm">{t('sign-in')}</span>
                            </Link>
                            <Link
                                to='/sign-up'
                                className="bg-transparent hover:bg-gray-200 text-white hover:text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1"
                                aria-label={t('sign-up')}
                            >
                                <FaUserPlus size={20} />
                                <span className="text-sm">{t('sign-up')}</span>
                            </Link>
                        </>
                    )}

                    <LanguageSelector
                        changeLanguage={changeLanguage}
                        currentLanguage={i18n.language}
                    />
                </div>

                <button
                    className="open-menu"
                    onClick={handleMenuClick}
                    aria-label="Open menu"
                >
                    <HiOutlineMenuAlt1 size={25} />
                </button>
            </div>
        </header>
    );
};

export default Header;
