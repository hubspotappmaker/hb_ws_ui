'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const RootFolderComponent = () => {
    const searchParams = useSearchParams();
    const encodedIframeURL = searchParams.get('iframe');
    const encodedDriveId = searchParams.get('driveId') || '';
    const encodedJsonFile = searchParams.get('jsonFile') || '';

    // Decode parameters and build the iframe URL with all query params
    const iframeURL = encodedIframeURL
        ? `${decodeURIComponent(encodedIframeURL)}?driveId=${encodeURIComponent(encodedDriveId)}&jsonFile=${encodeURIComponent(encodedJsonFile)}`
        : null;

    useEffect(() => {
        console.log('RootFolderComponent initialized with iframeURL:', iframeURL);
    }, [iframeURL]);

    return (
        <>
            {iframeURL ? (
                <iframe
                    src={iframeURL}
                    style={{ width: '100%', height: '100vh', border: 'none' }}
                    title="Root Folder Viewer"
                />
            ) : (
                <p>No root folder to select.</p>
            )}
        </>
    );
};

export default RootFolderComponent;
