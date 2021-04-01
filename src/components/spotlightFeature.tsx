import React, { useRef, useLayoutEffect } from "react"
import styled from "styled-components"
import { Link } from "gatsby"

const SpotlightSection = styled.section`
  position: relative;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  background: var(--color-landingSpotlight);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 80px 0;
  color: #e8c3a8;
  z-index: 0;
  overflow: hidden;

  h2 {
    padding: 50px 0;
    font-weight: 700;
    font-size: 44px;
    width: 70%;
    text-align: center;
    max-width: 500px;
  }
`

const HollowButton = styled(Link)`
  border-radius: 12px;
  border: 2px solid;
  padding: 10px;
  font-size: 24px;
  font-weight: 700;
`

const Spotlight = styled.div`
  background: #ffe5e5;
  width: 300px;
  height: 300px;
  z-index: 1;
  position: absolute;
  border-radius: 150px;
  mix-blend-mode: difference;
  pointer-events: none;
`

export const SpotlightFeature = () => {
  const areaRef = useRef<HTMLElement>()
  const spotlightElement = useRef<HTMLDivElement>()
  const speed = useRef(0.05)

  const mouse = useRef({ x: 0, y: 0 })
  const spotlightLocation = useRef({ x: 0, y: 0 })

  const animate = () => {
    const distX = mouse.current.x - spotlightLocation.current.x
    const distY = mouse.current.y - spotlightLocation.current.y

    spotlightLocation.current.x =
      spotlightLocation.current.x + distX * speed.current
    spotlightLocation.current.y =
      spotlightLocation.current.y + distY * speed.current

    if (spotlightElement.current) {
      spotlightElement.current.style.left = `${spotlightLocation.current.x}px`
      spotlightElement.current.style.top = `${spotlightLocation.current.y}px`
    }
    requestAnimationFrame(animate)
  }

  useLayoutEffect(() => {
    const areaWidth = areaRef.current.getBoundingClientRect().width
    const areaHeight = areaRef.current.getBoundingClientRect().height
    const spotWidth = spotlightElement.current.getBoundingClientRect().width
    const spotHeight = spotlightElement.current.getBoundingClientRect().height

    mouse.current.x = areaWidth / 2 - spotWidth / 2
    mouse.current.y = areaHeight / 2 - spotHeight / 2

    spotlightLocation.current = { x: mouse.current.x, y: mouse.current.y }

    animate()
  }, [])

  const handleMouseMove = event => {
    speed.current = 0.05
    mouse.current.x =
      event.pageX - spotlightElement.current.getBoundingClientRect().width / 2
    mouse.current.y =
      event.pageY -
      (window.pageYOffset + areaRef.current.getBoundingClientRect().top) -
      spotlightElement.current.getBoundingClientRect().height / 2
  }

  const handleMouseLeave = () => {
    speed.current = 0.02
    const areaWidth = areaRef.current.getBoundingClientRect().width
    const areaHeight = areaRef.current.getBoundingClientRect().height
    const spotWidth = spotlightElement.current.getBoundingClientRect().width
    const spotHeight = spotlightElement.current.getBoundingClientRect().height

    mouse.current.x = areaWidth / 2 - spotWidth / 2
    mouse.current.y = areaHeight / 2 - spotHeight / 2
  }

  return (
    <SpotlightSection
      ref={areaRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Spotlight ref={spotlightElement} />
      <h2>Mettre en valeur les producteurs locaux</h2>
      <HollowButton to="/blog">En savoir plus</HollowButton>
    </SpotlightSection>
  )
}
