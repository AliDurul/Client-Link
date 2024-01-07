import React from 'react'
import styles from './singlePost.module.css'
import Image from 'next/image'

const SinglePostPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <Image src='https://images.pexels.com/photos/16794803/pexels-photo-16794803/free-photo-of-building-on-a-pier.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load' alt='' fill className={styles.img} />
      </div>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>Title</h1>
        <div className={styles.detail}>
          <Image src='https://images.pexels.com/photos/16794803/pexels-photo-16794803/free-photo-of-building-on-a-pier.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load' alt='' className={styles.avatar} width={50} height={50} />

          <div className={styles.detailText}>
            <span className={styles.detailTitle}>Author</span>
            <span className={styles.detailValue}>Ali Durul</span>
          </div>
          <div className={styles.detailText}>
            <span className={styles.detailTitle}>Published</span>
            <span className={styles.detailValue}>01.01.2024</span>
          </div>
        </div>
        <div className={styles.content}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora aliquam eius fuga earum molestias voluptate aperiam neque sunt delectus similique.
        </div>

      </div>
    </div>
  )
}

export default SinglePostPage