import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import AudioPlayer from './AudioPlayer';
import { getAudioUrl } from '../helper';
import axios from 'axios';

type Props = {
  selectedUserVoiceSample: UserVoiceSample | null;
  setSelectedUserVoiceSample: (userVoiceSample: UserVoiceSample | null) => void;
};

// Add these new styled components at the top level
const Header = styled.div`
  padding: 24px 20px;
  text-align: center;
  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeaderText = styled.h2`
  color: #888;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
  margin-bottom: 8px;
`;

const CreditBalance = styled.h1`
  color: white;
  font-size: 48px;
  margin: 0;
  margin-bottom: 8px;
`;

const AddCreditsLink = styled.a`
  color: #4caf50;
  font-size: 14px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const UserList = styled.div`
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 8px 0;
  background-color: #2d2d2d;
  border-radius: 8px;
  color: white;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #3d3d3d;
    transform: translateX(5px);
  }
`;

const UserItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const RadioInput = styled.input`
  accent-color: #4caf50;
  cursor: pointer;
`;

const UserName = styled.span`
  color: white;
`;

export type UserVoiceSample = {
  name: string;
  address: string;
  emotionIds: string[];
};

const Landing = ({
  selectedUserVoiceSample,
  setSelectedUserVoiceSample,
}: Props) => {
  const [userVoiceSamples, setUserVoiceSamples] = useState<UserVoiceSample[]>(
    []
  );

  const fetchUserVoiceSamples = async () => {
    const response = await axios.get('http://localhost:8080/get-voice-docs');
    const data = response.data;
    setUserVoiceSamples(data);
  };

  useEffect(() => {
    fetchUserVoiceSamples();
  }, []);

  return (
    <Box>
      <Header>
        <HeaderText>AVA Credits</HeaderText>
        <CreditBalance>69</CreditBalance>
        <AddCreditsLink href="#">Add Credits</AddCreditsLink>
      </Header>
      <UserList>
        {userVoiceSamples.map((item) => (
          <UserItem
            key={item.name}
            onClick={() => setSelectedUserVoiceSample(item)}
          >
            <UserItemContent>
              <RadioInput
                type="radio"
                checked={selectedUserVoiceSample?.name === item.name}
                onChange={() => setSelectedUserVoiceSample(item)}
              />
              <UserName>{item.name}</UserName>
            </UserItemContent>
          </UserItem>
        ))}
      </UserList>
    </Box>
  );
};

export default Landing;
