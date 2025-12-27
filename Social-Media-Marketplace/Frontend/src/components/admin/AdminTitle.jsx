const AdminTitle = ({ text1, text2 }) => {
    return (
        <h1 className='text-xl font-medium text-left text-gray-700'>
            {text1} <span className="text-indigo-500 underline underline-offset-2">{text2}</span>
        </h1>
    )
}

export default AdminTitle