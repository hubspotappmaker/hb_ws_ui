'use client';
import { useSearchParams } from 'next/navigation';

const RootFolderComponent = () => {
    const searchParams = useSearchParams();
    const encodedIframeURL = searchParams.get('iframe');

    const iframeURL = encodedIframeURL ? decodeURIComponent(encodedIframeURL) : null;

    return (
        <>
            {iframeURL ? (
                <iframe
                    src={iframeURL}
                    style={{ width: '100%', height: '100vh', border: 'none' }}
                />
            ) : (
                <p>No root folder to select.</p>
            )}
        </>
    );
};

export default RootFolderComponent;
