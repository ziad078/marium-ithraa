import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IFormField } from "@/lib/types/interfaces";
import { ValidationErrors } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface Props extends IFormField {
    error: ValidationErrors;
}
const PhonenumberField = ({
    label,
    name,
    placeholder,
    disabled,
    autoFocus,
    error,
    defaultValue,
    readOnly,
}: Props) => {
    const [phone, setPhone] = useState(defaultValue)

    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="capitalize mb-2">
                {label}
            </Label>
            <Input
          type={"hidden"}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          name={name}
          id={name}
          defaultValue={defaultValue}
          readOnly={readOnly}
          value={phone}
        />
            <PhoneInput
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                value={phone}
                onChange={(value) => setPhone(value || '')}
                defaultCountry="SA"
                className={cn(
                    "h-9! w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
                    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
                    
                  )}
            />
            {error && error[name] && (
                <p
                    className={`text-accent mt-2 text-sm font-medium ${error[name] ? "text-destructive" : ""
                        }`}
                >
                    {error[name]}
                </p>
            )}
        </div>
    );
};

export default PhonenumberField