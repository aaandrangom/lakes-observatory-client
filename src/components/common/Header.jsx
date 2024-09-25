import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import UTNLetters from '/images/letters.png';
import { Link } from 'react-router-dom';
import { useTranslatedLinks } from '../../assets/options/data.js';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import LanguageSelector from './LanguageSelector.jsx';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FaUserCircle, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';

const Header = () => {
    const [open, setOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const menuRef = useRef(null);
    const submenuRef = useRef(null);
    const { isAuthenticated, isAdmin, logoutAction } = useAuth();
    const { t, i18n } = useTranslation();

    const handleMenuClick = useCallback(() => {
        setOpen((prevOpen) => !prevOpen);
        if (openSubmenu !== null) {
            setOpenSubmenu(null);
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = useCallback((id) => {
        setOpenSubmenu((prevId) => (prevId === id ? null : id));
    }, []);

    const handleMouseEnter = (id) => {
        if (window.innerWidth >= 768) {
            setOpenSubmenu(id); // Open submenu on hover
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 768) {
            setOpenSubmenu(null); // Close submenu on mouse leave
        }
    };

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

    const links = useMemo(
        () =>
            LinkData.map((link) => ({
                ...link,
                title: t(link.title),
            })),
        [t]
    );

    const filteredLinks = isAdmin
        ? links
        : links.filter((link) => link.title !== t('administration'));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                submenuRef.current &&
                !submenuRef.current.contains(event.target)
            ) {
                setOpenSubmenu(null);
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef, submenuRef]);

    if (!i18n.isInitialized) {
        return null;
    }

    return (
        <header className="bg-red-600 py-4 text-white sticky z-50 shadow-md top-0 left-0 w-full">
            <div className="container flex justify-between items-center px-4 mx-auto">
                <div className="logo flex items-center">
                    <img src={UTNLetters} alt="Logo" className="h-10" />
                </div>

                <button
                    className="lg:hidden block"
                    onClick={handleMenuClick}
                    aria-label="Abrir menú"
                >
                    <div className="text-white text-3xl">&#9776;</div>
                </button>

                <nav
                    ref={menuRef}
                    className={`absolute lg:static top-16 left-0 w-full lg:w-auto bg-red-600 lg:bg-transparent lg:flex items-center lg:gap-6 transition-all duration-300 z-40 ${open ? 'block' : 'hidden'}`}
                >
                    <ul className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 p-4 lg:p-0">
                        {filteredLinks.map((link) => (
                            <li
                                key={link.id}
                                className="relative w-full lg:w-auto"
                                ref={link.submenu ? submenuRef : null}
                                onMouseEnter={() => handleMouseEnter(link.id)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => {
                                        if (link.submenu && window.innerWidth < 768) {
                                            handleSubmenuToggle(link.id);
                                        } else {
                                            setOpen(false);
                                        }
                                    }}
                                >
                                    <Link
                                        className="text-[15px] text-white hover:text-gray-300 w-full lg:w-auto py-2"
                                        to={link.url}
                                        aria-label={t(`${link.title}`)}
                                    >
                                        {t(`${link.title}`)}
                                    </Link>
                                    {/* Show chevron icon only if there is a submenu and on mobile */}
                                    {link.submenu && window.innerWidth < 768 && (
                                        openSubmenu === link.id ?
                                            <FaChevronUp className="text-white" /> :
                                            <FaChevronDown className="text-white" />
                                    )}
                                </div>
                                {/* Submenu */}
                                {link.submenu && (
                                    <ul
                                        className={`absolute bg-white text-gray-800 py-2 rounded-lg shadow-lg transition-all duration-300 z-20 w-48 left-0 lg:left-auto lg:top-14 ${openSubmenu === link.id ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                                    >
                                        {link.submenu.map((submenuItem) => (
                                            <li
                                                key={submenuItem.id}
                                                className="hover:bg-red-600 hover:text-white transition-colors duration-300"
                                            >
                                                <Link
                                                    to={submenuItem.url}
                                                    className="text-[15px] block px-4 py-2"
                                                    aria-label={t(`${submenuItem.title}`)}
                                                    onClick={() => setOpen(false)}
                                                >
                                                    {t(`${submenuItem.title}`)}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/profile"
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
                                to="/sign-in"
                                className="bg-transparent hover:bg-gray-200 text-white hover:text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1"
                                aria-label={t('sign-in')}
                            >
                                <FaUserCircle size={20} />
                                <span className="text-sm">{t('sign-in')}</span>
                            </Link>
                            <Link
                                to="/sign-up"
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
            </div>
        </header>
    );
};

export default Header;
