import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import FullPagePreview from '../components/FullPagePreview';
import { useAppContext } from '../context/AppContext';

function PreviewPage() {
    const { id } = useParams();

    const { activeProject: project, loadingActiveProject, loadProject } = useAppContext();

    useEffect(() => {
        if (id) loadProject(id);
    }, [id]);

    if (loadingActiveProject || !project) {
        return <Loading />;
    }

    return <FullPagePreview files={project.files} />;
}

export default PreviewPage