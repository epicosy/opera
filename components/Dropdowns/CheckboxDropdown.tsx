import * as React from 'react';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon } from '@radix-ui/react-icons';
import {ChangeEvent} from "react";


interface CheckboxMenuItemProps {
    value: any;
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}


const CheckboxMenuItem = ({ value, checked, onChange } : CheckboxMenuItemProps) => {
    return (
        <label className="flex items-center space-x-2">
            <input
                type="checkbox"
                className="form-checkbox text-indigo-600"
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <span>{value === null ? "Null" : value.toString()}</span>
            {checked && <CheckIcon className="w-5 h-5 text-indigo-600" />}
        </label>
    );
};


interface DropdownWithCheckboxesProps {
    title: string;
    items: any[];
    selectedItems: any[];
    onChange: (items: any[]) => void;
}


export default function DropdownWithCheckboxes({ title, items, selectedItems, onChange }: DropdownWithCheckboxesProps) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className="inline-flex items-center space-x-2">
                <span>{title}:</span>
                <span className="font-bold">{selectedItems.length}/{items.length}</span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white p-4 shadow-lg max-h-60 overflow-y-auto">
                {items.map((item) => (
                    <CheckboxMenuItem
                        key={item}
                        value={item}
                        checked={selectedItems.includes(item)}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) {
                                onChange([...selectedItems, item]);
                            } else {
                                onChange(selectedItems.filter((selectedItem) => selectedItem !== item));
                            }
                        }}
                    />
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

