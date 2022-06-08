export default function DefaultLayout({ children }) {
    return (
        <div className="w-full min-h-screen flex place-items-center place-content-center bg-base-300">{children}</div>
    );
}
