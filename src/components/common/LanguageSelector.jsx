// LanguageSelector.js
import React from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

const languageOptions = [
    { value: 'es', label: 'Español', flag: '/images/languages/es.svg' },
    { value: 'en', label: 'Inglés', flag: '/images/languages/us.svg' },
    { value: 'ru', label: 'Ruso', flag: '/images/languages/ru.svg' }
];

const customStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: 'transparent',
        border: '1px solid white',
        borderRadius: '4px',
        minHeight: '38px',
        boxShadow: 'none',
        '&:hover': {
            borderColor: 'white',
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'white',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#FDE68A' : 'white',
        color: '#4A4A4A',
        '&:hover': {
            backgroundColor: '#FDE68A',
            color: 'blue',
        },
    }),
    menu: (provided) => ({
        ...provided,
        minWidth: '150px',
        maxWidth: '300px',
        width: 'auto',
        backgroundColor: '#1F2937',
        borderRadius: '4px',
        marginTop: '2px',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'white',
    }),
};

const CustomOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="flex items-center p-2 cursor-pointer hover:bg-gray-100">
        <img src={data.flag} alt={label} className="w-5 h-5 mr-2" />
        <span>{label}</span>
    </div>
);

const LanguageSelector = ({ changeLanguage, currentLanguage }) => {
    const { t } = useTranslation();

    const extendedLanguageOptions = languageOptions.map(option => ({
        ...option,
        label: t(`languages-${option.value}`),
    }));

    return (
        <Select
            options={extendedLanguageOptions}
            onChange={changeLanguage}
            value={extendedLanguageOptions.find(option => option.value === currentLanguage)}
            styles={customStyles}
            isSearchable={false}
            components={{ Option: CustomOption }}
        />
    );
};

export default LanguageSelector;
