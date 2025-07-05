import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #050505 0%, #111114 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 100px 20px 40px;
  color: #fff;
`;

const OverlayGrid = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('/assets/grid.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.06;
  z-index: 0;
`;

const ElectricBlob = styled.img`
  position: absolute;
  width: ${(props) => props.size || '400px'};
  top: ${(props) => props.top || 'auto'};
  bottom: ${(props) => props.bottom || 'auto'};
  left: ${(props) => props.left || 'auto'};
  right: ${(props) => props.right || 'auto'};
  opacity: 0.1;
  z-index: 0;
  pointer-events: none;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  z-index: 1;
  width: 100%;
  max-width: 1440px;
  margin-top: 40px;
`;

const GlassCard = styled(motion.div)`
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 60px 40px;
  border-radius: 24px;
  text-align: center;
  z-index: 1;
  box-shadow: 0 10px 60px rgba(0, 255, 255, 0.05);
  transition: 0.4s ease;

  &:hover {
    transform: scale(1.02) rotate(0.3deg);
    box-shadow: 0 0 25px rgba(0, 229, 255, 0.1);
  }
`;

const MainHeading = styled.h1`
  font-size: clamp(2.2rem, 6vw, 3.2rem);
  font-weight: 800;
  background: linear-gradient(90deg, #00fff0, #0080ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
`;

const SubText = styled.p`
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  color: #d0f0ff;
  margin-bottom: 32px;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  margin-top: 20px;
`;

const CTAButton = styled.button`
  background-color: #00e5ff;
  color: #000;
  font-weight: 600;
  padding: 14px 30px;
  font-size: 1rem;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.2);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #00bcd4;
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(0, 150, 136, 0.4);
  }
`;

const MoreInfo = styled.div`
  margin-top: 20px;
  color: #9beefb;
  font-size: 0.95rem;
  line-height: 1.5;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const Hero = () => {
  const history = useHistory();
  const [infoVisible, setInfoVisible] = useState(null); // will hold which card's info is visible

  const toggleInfo = (id) => {
    setInfoVisible(infoVisible === id ? null : id);
  };

  return (
    <HeroSection>
      <OverlayGrid />
      <ElectricBlob src="/assets/blob1.svg" top="5%" left="-80px" size="500px" />
      <ElectricBlob src="/assets/blob2.svg" bottom="-50px" right="-60px" size="600px" />

      <CardGrid>
        <GlassCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <MainHeading>🧩 AI Flowcharts</MainHeading>
          <SubText>
            Visually build, optimize, and automate complex workflows using intelligent, dynamic flowcharts powered by AI.
          </SubText>
          <ButtonGroup>
            <CTAButton onClick={() => history.push('/login')}>Start Now</CTAButton>
            <CTAButton onClick={() => toggleInfo('flowcharts')}>Learn More</CTAButton>
          </ButtonGroup>
          {infoVisible === 'flowcharts' && (
            <MoreInfo>
              Our AI Flowcharts let you drag and drop components to design workflows that adapt and evolve. Perfect for teams looking to automate and visualize business processes with ease.
            </MoreInfo>
          )}
        </GlassCard>

        <GlassCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <MainHeading>📊 Product Management Platform</MainHeading>
          <SubText>
            Streamline your entire product lifecycle with a robust platform tailored to product teams, integrating planning, tracking, and collaboration.
          </SubText>
          <ButtonGroup>
            <CTAButton onClick={() => history.push('/login')}>Get Started</CTAButton>
            <CTAButton onClick={() => toggleInfo('product')}>Learn More</CTAButton>
          </ButtonGroup>
          {infoVisible === 'product' && (
            <MoreInfo>
              Manage roadmaps, backlogs, and releases with powerful tools designed to keep your teams aligned and moving forward. Features include customizable dashboards, real-time updates, and stakeholder communication.
            </MoreInfo>
          )}
        </GlassCard>

        <GlassCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          <MainHeading>🤖 Business AI Chatbot</MainHeading>
          <SubText>
            Engage customers and internal teams with a smart chatbot that understands business context and delivers insights instantly.
          </SubText>
          <ButtonGroup>
            <CTAButton onClick={() => history.push('/login')}>Try It Now</CTAButton>
            <CTAButton onClick={() => toggleInfo('chatbot')}>Learn More</CTAButton>
          </ButtonGroup>
          {infoVisible === 'chatbot' && (
            <MoreInfo>
              Our AI chatbot integrates seamlessly with your CRM, data sources, and workflows — offering natural language queries, instant reporting, and actionable recommendations.
            </MoreInfo>
          )}
        </GlassCard>
      </CardGrid>
    </HeroSection>
  );
};

export default Hero;
