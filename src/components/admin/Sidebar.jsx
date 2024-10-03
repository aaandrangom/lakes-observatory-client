import React, { useEffect, useState, useRef, useMemo } from "react";
import UTNLetters from '/images/letters.png';
import { FaUserCircle, FaSignOutAlt, FaBars, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslatedLinks } from '../../assets/options/data.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { initializeDriver, shouldShowTour, markTourAsShown } from '../../assets/tours/optionsAdmin.js';

const Sidebar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const { isAuthenticated, logoutAction } = useAuth();
    const { administrator } = useTranslatedLinks();
    const { t } = useTranslation();

    const handleLogout = async (e) => {

        e.preventDefault();

        toast.promise(
            (async () => {
                const response = await logoutAction();
                console.log(response);
                if (response.status === 200) {
                    return response.data?.message;
                }

                throw new Error(response.data?.message);

            })(),
            {
                loading: 'Cerrando sesión...',
                success: (msg) => `${msg}`,
                error: (err) => `${err.message}`
            }
        );
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setOpenSubmenus({});
    };

    const toggleSubmenu = (id) => {
        setOpenSubmenus(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const closeMenu = () => {
        setMenuOpen(false);
        setOpenSubmenus({});
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setMenuOpen(false);
                setOpenSubmenus({});
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const links = useMemo(() => administrator.map(link => ({
        ...link,
        title: t(link.title),
    })), [t, administrator]);

    useEffect(() => {
        if (shouldShowTour()) {
            const driverObj = initializeDriver();
            driverObj.drive();
            markTourAsShown();
        }
    }, [])


    return (
        <div className="flex h-screen" >
            <button
                className="lg:hidden fixed top-4 left-4 z-50 bg-red-600 text-white p-2 rounded"
                onClick={toggleMenu}
            >
                <FaBars />
            </button>

            <div
                className={`bg-red-600 text-white w-64 flex-shrink-0 fixed top-0 left-0 h-full overflow-y-auto transition-all duration-300 z-40 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
                ref={sidebarRef}
                id="welcome"
            >
                <div className="py-4 text-center">
                    <img src={UTNLetters} alt="logo" className="h-10 mx-auto" />
                </div>
                <nav>
                    <ul className="mt-6" >
                        {links.map((item) => (
                            <li id={item.ref} key={item.id}>
                                {item.submenu ? (
                                    <div>
                                        <button
                                            className="py-2 px-4 text-sm text-white hover:bg-gray-800 hover:text-gray-200 flex items-center justify-between w-full"
                                            onClick={() => toggleSubmenu(item.id)}
                                        >
                                            <span className="flex items-center">
                                                {item.icon && <item.icon className="mr-2 text-lg" />}
                                                {item.title}
                                            </span>
                                            {openSubmenus[item.id] ? <FaChevronUp className="text-lg" /> : <FaChevronDown className="text-lg" />}
                                        </button>
                                        {openSubmenus[item.id] && (
                                            <ul className="ml-4">
                                                {item.submenu.map((subItem) => (
                                                    <li key={subItem.id}>
                                                        <Link
                                                            className="py-2 px-4 text-sm text-white hover:bg-gray-800 hover:text-gray-200 flex items-center"
                                                            to={subItem.url}
                                                            onClick={closeMenu}
                                                        >
                                                            <subItem.icon className="mr-2 text-lg" />
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        className="py-2 px-4 text-sm text-white hover:bg-gray-800 hover:text-gray-200 flex items-center"
                                        to={item.url}
                                        onClick={closeMenu}
                                    >
                                        <item.icon className="mr-2 text-lg" />
                                        <span>{item.title}</span>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="absolute bottom-0 w-full text-center pb-4">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/admin-profile"
                                className="bg-transparent hover:bg-gray-200 text-white hover:text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1 mt-4 mx-auto w-11/12"
                                onClick={closeMenu}
                            >
                                <FaUserCircle size={20} />
                                <span>Perfil</span>
                            </Link>
                            <button
                                className="bg-transparent hover:bg-gray-200 text-white hover:text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1 mt-4 mx-auto w-11/12"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt size={20} />
                                <span>Cerrar Sesión</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="bg-transparent hover:bg-gray-200 text-white hover:text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1 mx-auto w-11/12"
                                onClick={closeMenu}
                            >
                                <FaUserCircle size={20} />
                                <span>Iniciar Sesión</span>
                            </Link>
                            <Link
                                to="/register"
                                className="bg-transparent hover:bg-gray-200 text-white hover:text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1 mt-4 mx-auto w-11/12"
                                onClick={closeMenu}
                            >
                                <FaUserCircle size={20} />
                                <span>Registrarte</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 ml-0 lg:ml-64">
                <main className="px-4 py-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Sidebar;
