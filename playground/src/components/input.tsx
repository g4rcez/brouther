export const Input = (props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
    return (
        <span className="inline-flex flex-col">
            <label htmlFor={props.name || props.id}>{props.placeholder}</label>
            <input {...props} className={`border border-black/20 p-2 m-0 rounded ${props.className}`} />
        </span>
    );
};
