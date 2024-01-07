import Image from 'next/image'
import React from 'react'
import styles from './about.module.css'
const About = () => {
  return (
    <div>
      <div className={styles.imgContainer}>
      <Image src='/about.png' alt='about' fill/>

      </div>
    </div>
  )
}

export default About