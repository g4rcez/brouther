type Props = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const Button = (props: Props) => <button {...props} className={`px-4 py-2 rounded-lg ${props.className ?? ""}`} />;
