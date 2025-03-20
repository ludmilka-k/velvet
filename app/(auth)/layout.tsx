export default  function AuthLayout({children}: {children: React.ReactNode}) {
    return (
        <div className='flex h-screen flex-col'>
            <main className='flex-center min-h-screen w-full'>{children}</main>
        </div>
    );
}