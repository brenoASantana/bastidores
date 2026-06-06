interface GameButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'danger' | 'outline';
}

export function GameButton({ onClick, children, variant = 'primary' }: GameButtonProps) {
    const styles = {
        primary: "bg-yellow-700 hover:bg-yellow-600 text-white",
        danger: "bg-red-900 hover:border-red-900 text-white",
        outline: "border-2 border-white text-white hover:bg-white hover:text-black"
    };

    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 font-mono text-lg transition-colors duration-200 ${styles[variant]}`}
        >
            {children}
        </button>
    );
}