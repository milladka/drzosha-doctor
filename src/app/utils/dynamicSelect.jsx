import { useEffect, useRef, useState } from "react";

const DynamicSelect = ({ options, onSelect, label, selectedOption, error = false }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(selectedOption || "");
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (selectedOption !== undefined && selectedOption !== null) {
            setSelected(selectedOption);
        }
    }, [selectedOption]);

    const showLabel = () => {
        const objSelected = options.find(item => item.value === selected);
        return objSelected?.label || label || "یک گزینه انتخاب کنید";
    };

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full text-right" ref={dropdownRef}>
            <div
                className={`${error && 'border-red-500'} border rounded-md p-2 flex justify-between items-center cursor-pointer bg-white`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-light text-sm text-slate-600">
                    {showLabel()}
                </span>
                <svg className={`${isOpen && 'rotate-180'} w-4 h-4 transition-all text-slate-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
            {isOpen && (
                <div className="absolute w-full mt-2 p-2 bg-white border rounded-lg shadow-lg text-right z-50">
                    <input
                        className="mb-2 border text-sm p-1 rounded w-full text-right outline-none"
                        placeholder="جستجو..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="max-h-40 overflow-y-auto">
                        {filteredOptions.map(option => (
                            <div
                                key={option.value}
                                className={`p-2 hover:bg-gray-100 cursor-pointer rounded text-sm text-slate-700 ${option.value == selected && 'bg-slate-200'}`}
                                onClick={() => {
                                    setSelected(option.value);
                                    setIsOpen(false);
                                    onSelect(option.value);
                                }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DynamicSelect;