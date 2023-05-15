import * as React from 'react';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon } from '@radix-ui/react-icons';

const CheckboxMenuItem = ({ value, checked, onChange }) => {
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

export default function DropdownWithCheckboxes({ title, items, selectedItems, onChange }) {
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
                        onChange={(e) => {
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

