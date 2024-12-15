'use client'

import React from 'react'
import {
  FaXTwitter,
  FaGithub,
  FaInstagram,
  FaRss,
  FaLinkedinIn,
} from 'react-icons/fa6'
import { TbMailFilled } from 'react-icons/tb'
import { metaData, socialLinks } from 'app/config'

// No require() statements, only import statements above.

const YEAR = new Date().getFullYear()

function SocialLink({
  href,
  icon: Icon,
}: {
  href: string
  icon: React.ElementType
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-80 transition-opacity"
    >
      <Icon />
    </a>
  )
}

function SocialLinks() {
  return (
    <div className="flex gap-3.5 text-lg">
      <SocialLink href={socialLinks.twitter} icon={FaXTwitter} />
      <SocialLink href={socialLinks.github} icon={FaGithub} />
      <SocialLink href={socialLinks.instagram} icon={FaInstagram} />
      <SocialLink href={socialLinks.linkedin} icon={FaLinkedinIn} />
      <SocialLink href={socialLinks.email} icon={TbMailFilled} />
      <a
        href="/rss.xml"
        target="_self"
        className="hover:opacity-80 transition-opacity"
      >
        <FaRss />
      </a>
    </div>
  )
}

export default function Footer() {
  return (
    <small className="flex justify-between items-center py-8 text-[#1C1C1C] dark:text-[#D4D4D4]">
      <span>
        <time>© {YEAR}</time>{' '}
        <a
          className="no-underline hover:opacity-80 transition-opacity"
          href={socialLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
        >
          {metaData.title}
        </a>
      </span>
      <SocialLinks />
    </small>
  )
}
