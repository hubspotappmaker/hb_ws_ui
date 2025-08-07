'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const RootFolderComponent = () => {
    const searchParams = useSearchParams();
    const encodedIframeURL = searchParams.get('iframe');
    const encodedDriveId = searchParams.get('driveId') || '';
    const encodedJsonFile = searchParams.get('jsonFile') || '';

    const iframeURL = encodedIframeURL ? decodeURIComponent(encodedIframeURL + `&driveId=${encodedDriveId}` + `&jsonFile=${encodedJsonFile}`) : null;
    useEffect(() => {
        console.log("check iframeURL: ", iframeURL);
    }, [])
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
