function AdminError({message}) {
    if (!message) return null;
    return(
        <div
            role="alert"
        >    
            {message}
        </div>
    )
}