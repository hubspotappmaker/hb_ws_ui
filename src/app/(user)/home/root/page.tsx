// pages/home/root/page.js
import dynamic from 'next/dynamic';

const RootFolderComponent = dynamic(() => import('../../../../component/home/RootFolderComponent'), {
    ssr: false, // Disables server-side rendering for this component
});

const RootFolderPage = () => {
    return <RootFolderComponent />;
};

export default RootFolderPage;