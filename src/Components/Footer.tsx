function Footer() {
    return (
        <footer className ="w-full bg-auto-primary text-auto-secondary py-4 mt-8">
            <div className="bg-auto-secondary/30 backdrop-blur-sm border-t border-auto max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 rounded-t-3xl text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} TurnoCare. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}

export default Footer;