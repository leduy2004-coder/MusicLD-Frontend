import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserAuth } from '~/components/Store';
import ActionsApp from '~/components/ActionsApp';
import MusicDetail from '~/components/MusicDetail';


function Music() {
    const { login } = useParams();
    const { setOpenFormLogin } = UserAuth();
    const [isLoginFormOpened, setIsLoginFormOpened] = useState(false);

    useEffect(() => {
        if (login && !isLoginFormOpened) {
            setOpenFormLogin(true);
            setIsLoginFormOpened(true);
        }
    }, [isLoginFormOpened, setOpenFormLogin, login]);

    return (
        <div>
            <MusicDetail/>
            <ActionsApp />
        </div>
    );
}

export default Music;
