import React from 'react';
import Btn from '../Button';
import { UserAuth } from '~/components/Store';

function ButtonFollow({ followStatus, profileUser, className, handleFollowAction }) {
    const { userAuth, tokenStr, setOpenFormLogin } = UserAuth();
    const actions = {
        CANCELED: () => handleFollowAction('PENDING'),
        ACCEPTED: () => handleFollowAction('CANCELED'),
        FRIEND: () => handleFollowAction('CANCELED'),
        PENDING: () => handleFollowAction('CANCELED'),
        RECEIVED: () => handleFollowAction('ACCEPTED'),
        null: () => handleFollowAction('PENDING'),
    };

    const buttonText = {
        CANCELED: 'Follow',
        ACCEPTED: 'Xóa',
        FRIEND: 'Hủy Follow',
        PENDING: 'Hủy lời mời',
        RECEIVED: 'Chấp nhận',
        null: 'Follow',
    };

    if (!userAuth || !tokenStr) {
        return (
            <Btn onClick={() => setOpenFormLogin(true)} outline large>
                Follow
            </Btn>
        );
    }

    if (userAuth.id === profileUser?.id) return null;

    return (
        <Btn
            onClick={(e) => {
                e.stopPropagation(); // Stop event from propagating to parent elements
                actions[followStatus](); // Call the passed onClick function if any
            }}
            outline
            large
            className={className}
        >
            {buttonText[followStatus]}
        </Btn>
    );
}

export default ButtonFollow;
