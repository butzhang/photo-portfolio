'use client'

import React from 'react'
import { FaInstagram } from 'react-icons/fa6'
import { TbMailFilled } from 'react-icons/tb'
import { metaData, socialLinks } from 'app/config'

const YEAR = new Date().getFullYear()

// Updated type for icon to use more specific React.ComponentType
function SocialLink({
  href,
  icon: Icon,
}: {
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
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
  const availableLinks = [
    //{ key: "twitter", href: socialLinks.twitter, icon: FaXTwitter },
    //{ key: "github", href: socialLinks.github, icon: FaGithub },
    { key: 'instagram', href: socialLinks.instagram, icon: FaInstagram },
    //{ key: "linkedin", href: socialLinks.linkedin, icon: FaLinkedinIn },
    { key: 'email', href: socialLinks.email, icon: TbMailFilled },
  ]

  return (
    <div className="flex gap-3.5 text-lg">
      {availableLinks
        .filter((link) => link.href)
        .map((link) => (
          <SocialLink key={link.key} href={link.href!} icon={link.icon} />
        ))}

      {/* RSS is always shown. If you want to conditionally show it, wrap in a check */}
      {/*<a href="/rss.xml" target="_self" className="hover:opacity-80 transition-opacity">*/}
      {/*  <FaRss />*/}
      {/*</a>*/}
    </div>
  )
}

export default function Footer() {
  return (
    <small className="flex justify-between items-center py-8 text-[#1C1C1C] dark:text-[#D4D4D4]">
      <span>
        <time>© {YEAR}</time>{' '}
        {socialLinks.twitter ? (
          <a
            className="no-underline hover:opacity-80 transition-opacity"
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            {metaData.title}
          </a>
        ) : (
          <span>{metaData.title}</span>
        )}
      </span>
      <SocialLinks />
    </small>
  )
}
