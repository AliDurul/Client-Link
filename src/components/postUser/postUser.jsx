import React from 'react'
import styles from './postUser.module.css'
import { getUser } from '@/lib/data'




const PostUser = async ({ userId }) => {

    const user = await getUser(userId)
    console.log(user);

    return (
        <div className={styles.container}>
            <span className={styles.title}>Author</span>
            <span className={styles.username}>{user?.name}</span>
        </div>
    )
}

export default PostUser