import { Modal } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { setViewOrganizationModal } from '../../../store/reducers/usersSlice.js';

const ViewOrganizationList = () => {
    const { viewOrganizationModal, selectedUser } = useSelector((state) => state.users);

    const { organizationListById } = useSelector((state) => state.organization);
    const dispatch = useDispatch();

    console.log(organizationListById, 'organizationListById');

    const onCloseModal = () => {
        dispatch(setViewOrganizationModal(false));
    };

    return (
        <>
            <Modal
                opened={viewOrganizationModal}
                onClose={onCloseModal}
                title={`Профили WB: ${selectedUser?.fio}`}
                size="50%"
            ></Modal>
        </>
    );
};

export default ViewOrganizationList;
