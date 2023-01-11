import { Button, Modal } from "antd"
import { CloseOutlined, PlusOutlined, UserOutlined, DeleteOutlined, LikeFilled} from '@ant-design/icons';
import Service from "./service"
import { useState } from "react";

const SetFollowButton = props => {
    const HandleClick = () => {
        Service.setFollow(props.me, props.other)
            .then(() => {
                Modal.info({
                    title: 'Followed!',
                    cancelText: 'OK'
                });
                props.func(true);
            })
            .catch(err => {
                Modal.error({
                    title: 'Failed!',
                    content:err,
                    cancelText: 'OK'
                });
            })
    }
    return (
        <Button
            type="link"
            size="small"
            icon={<PlusOutlined />}
            onClick={HandleClick}
        >Follow</Button>
    )
}

const SetUnfollowButton = props => {
    const HandleClick = () => {
        Service.setUnfollow(props.me, props.other)
            .then(() => {
                Modal.info({
                    title: 'Unfollowed!',
                    cancelText: 'OK'
                });
                props.func(false);
            })
            .catch(err => {
                Modal.error({
                    title: 'Failed!',
                    content:err,
                    cancelText: 'OK'
                });
            })
    }
    return (
        <Button
            type="text"
            size="small"
            danger={true}
            icon={<CloseOutlined />}
            onClick={HandleClick}
        >Unfollow</Button>
    )
}

const Follow = props => {
    const [followed, setFollowed] = useState(props.hasFollowed);

    return (<div>
        {followed?
            <SetUnfollowButton me={props.me} other={props.other} func={setFollowed}/>
            : <SetFollowButton me={props.me} other={props.other} func={setFollowed}/>}
    </div>);
}

export default Follow;