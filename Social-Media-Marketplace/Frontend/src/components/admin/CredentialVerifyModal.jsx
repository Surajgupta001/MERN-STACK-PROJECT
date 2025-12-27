import { useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { ArrowUpRightFromSquareIcon, CopyIcon, Loader2Icon, XIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dummyOrders, getProfileLink } from '../../assets/assets';

const CredentialVerifyModal = ({ listing, onClose }) => {

    const [loading, setLoading] = useState(true);
    const [credential, setCredential] = useState(null);
    const [isVerified, setIsVerified] = useState(false);

    const profileLink = getProfileLink(listing.platform, listing.username);

    const copyToClipboard = ({ name, value }) => {
        navigator.clipboard.writeText(value);
        toast.success(`${name} copied to clipboard`);
    };

    const fetchCredential = async () => {
        setCredential(dummyOrders[0].credential)
        setLoading(false);
    };

    const verifyCredential = async () => {

    };

    useEffect(() => {
        fetchCredential();
    }, []);

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black/70 backdrop-blur z-100 sm:p-4'>
            <div className='bg-white sm:rounded-lg shadow-2xl w-full max-w-xl h-screen sm:h-[400px] flex flex-col'>
                {/* Header */}
                <div className='flex items-center justify-between p-4 text-white bg-linear-to-r from-indigo-600 to-indigo-400 sm:rounded-t-lg'>
                    <div className='flex-1 min-w-0'>
                        <h3 className='text-lg font-semibold truncate'>{listing?.title}</h3>
                        <p className='text-sm text-indigo-100 truncate'>
                            verifying Credentials for <span className='font-medium text-white'>{listing?.username}</span> on {listing?.platform}
                        </p>
                    </div>
                    <button onClick={onClose} className='p-1 ml-4 transition-colors rounded-lg hover:bg-white/20 hover:bg-opacity-20'>
                        <XIcon className='w-5 h-5' />
                    </button>
                </div>

                {/* preview credentials */}
                {loading ? (
                    <div className='flex items-center justify-center h-full'>
                        <Loader2Icon className='text-indigo-500 animate-spin size-6' />
                    </div>
                ) : (
                    <div className='flex flex-col items-start gap-3 p-4 overflow-y-scroll text-gray-700'>
                        {credential?.originalCredential.map((cred, index) => (
                            <div key={index} className='flex items-center w-full gap-2 group'>
                                <span className='font-medium'>{cred.name}</span> : {cred.name.toLowerCase() === 'password' ? '********' : cred?.value} <CopyIcon onClick={() => copyToClipboard(cred)} size={14} className='invisible group-hover:visible' />
                            </div>
                        ))}

                        <div className='flex items-center gap-1 text-sm'>
                            <p>Open Platform : </p>
                            <Link to={profileLink} target='_blank' className='flex items-center gap-1 text-indigo-500'>
                                click here
                                <ArrowUpRightFromSquareIcon size={13} />
                            </Link>
                        </div>

                        <div className='flex items-start gap-2 mt-2'>
                            <input type='checkbox' onChange={() => setIsVerified((prev) => !prev)} className='size-4 mt-0.5 text-indigo-500 bg-gray-100' />
                            <p className='text-sm text-gray-500'>
                                Please verify the credentials above and click on the button below to verify. <br /> If credential are not correct, please contact the owner of the listing.
                            </p>
                        </div>

                        <button onClick={verifyCredential} disabled={!isVerified} className='px-5 py-2 mt-2 text-sm font-medium text-white bg-indigo-500 rounded-md not-disabled:hover:bg-indigo-700 disabled:opacity-50'>
                            Verify Credentials
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CredentialVerifyModal;
