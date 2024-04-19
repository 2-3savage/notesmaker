import React from 'react'
import styles from '../../Menu.module.css'

const SearchItem = ({ Icon, toggleNavbar, navbar }) => {
  return (
    <div>
        <li onClick={navbar === "close" ? toggleNavbar : null} className={styles.search_box}>
            <Icon  className={styles.icon}/>
            <input type='search' placeholder='Search...'/>
        </li>
    </div>
  )
}

export default SearchItem
