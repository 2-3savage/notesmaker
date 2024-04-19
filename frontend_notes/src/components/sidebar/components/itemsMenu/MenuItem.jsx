import React from 'react'
import styles from '../../Menu.module.css'
import { Link } from 'react-router-dom'
const MenuItem = ( { Icon, text, route } ) => {
  return (
    <div>
      <li className={styles.nav_link}>
            <Link draggable={false} to={route} className={styles.a}>
                <Icon className={styles.icon}/>
                <span className={`${styles.text} ${styles.nav_text}`}>{text}</span>
            </Link>
      </li>
        
    </div>
  )
}

export default MenuItem
