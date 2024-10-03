import {
    FaDatabase, FaSlidersH,
    FaTint
} from "react-icons/fa";

import {
    AiOutlineDashboard, AiOutlineCloudUpload, AiOutlineDatabase,
    AiOutlineBarChart, AiOutlineSetting, AiOutlineHistory,
    AiOutlineDownload, AiOutlineMail
} from "react-icons/ai";

import { IoNotificationsOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { MdTimeline } from 'react-icons/md';

import { useTranslation } from 'react-i18next';

export const useTranslatedLinks = () => {
    const { t } = useTranslation();

    const LinkData = [
        {
            id: 1,
            title: t("home"),
            url: "/",
        },
        {
            id: 2,
            title: t("meet-us"),
            /*submenu: [
                {
                    id: 2.1,
                    title: t('opcion1'),
                    url: "/opcion1"
                },
                {
                    id: 2.2,
                    title: t('opcion1'),
                    url: "/opcion1"
                },
                {
                    id: 2.3,
                    title: t('opcion1'),
                    url: "/opcion1"
                }
            ]*/
        },
        {
            id: 4,
            title: t("publications"),
            submenu: [
                {
                    id: 4.1,
                    title: t('data'),
                    url: "/data"
                }
            ]
        },
        {
            id: 5,
            title: t("news"),
        },
        {
            id: 6,
            title: t("contact-us"),
            url: "/contact-us",
        },
        {
            id: 7,
            title: t("administration"),
            url: "/administration",
        },
    ];

    const courses = [
        {
            id: 1,
            cover: "../images/yahuarcocha.jpg",
            title: t("course.repositorio"),
        },
    ];

    const administrator = [
        {
            id: 1,
            title: t('dashboard'),
            url: "/admin/dashboard",
            icon: AiOutlineDashboard,
            ref: "dashboard"
        },
        {
            id: 2,
            title: t('upload-data'),
            url: "/admin/upload-data",
            icon: AiOutlineCloudUpload,
            ref: "upload-data"
        },
        {
            id: 3,
            title: t('manage-data'),
            url: "/admin/manage-data",
            icon: AiOutlineDatabase,
            ref: "manage-data",
            submenu: [
                {
                    id: 1.2,
                    title: t("lakes"),
                    url: "/admin/manage-data/lakes",
                    icon: FaTint,
                },
                {
                    id: 1.3,
                    title: t("parameters"),
                    url: "/admin/manage-data/parameters",
                    icon: FaSlidersH,
                },
                {
                    id: 1.4,
                    title: t("measurements"),
                    url: "/admin/manage-data/measurements",
                    icon: MdTimeline,
                },

            ]
        },
        {
            id: 4,
            title: t('charts-and-reports'),
            url: "/admin/charts-and-reports",
            icon: AiOutlineBarChart,
            ref: "charts-and-reports"
        },
        {
            id: 5,
            title: t('user-management'),
            url: "/admin/user-management",
            icon: FiUsers,
            ref: "user-management"
        },
        {
            id: 6,
            title: t('settings'),
            url: "/admin/settings",
            icon: AiOutlineSetting,
            ref: "settings",
            submenu: [
                {
                    id: 1.2,
                    title: t("email-sender"),
                    url: "/admin/settings/email-sender",
                    icon: AiOutlineMail,
                }

            ]
        },
        {
            id: 7,
            title: t('activity-log'),
            url: "/admin/activity-log",
            icon: AiOutlineHistory,
            ref: "activity-log"
        },
        {
            id: 8,
            title: t('notifications-and-alerts'),
            url: "/admin/notifications-and-alerts",
            icon: IoNotificationsOutline,
            ref: "notifications-and-alerts"
        },
        ,
        {
            id: 9,
            title: t('export-data'),
            url: "/admin/export-data",
            icon: AiOutlineDownload,
            ref: "export-data"
        }

    ]

    const administrator2 = [
        {
            id: 1,
            title: t("data"),
            url: "/admin/data",
            icon: FaDatabase,
            submenu: [
                {
                    id: 1.2,
                    title: t("lakes"),
                    url: "/admin/data/lakes",
                    icon: FaTint,
                },
                {
                    id: 1.3,
                    title: t("parameters"),
                    url: "/admin/data/parameters",
                    icon: FaSlidersH,
                },

            ]

        },

    ];

    return { LinkData, courses, administrator };
};
