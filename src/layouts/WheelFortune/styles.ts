import styled from 'styled-components';

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex: 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 20px;
`;

const Input = styled.input`
  box-sizing: border-box;
  font-size: 14px;
  outline: none;
  padding: 4px 8px;
  width: 100%;
  height: 28px;
  background: #686868;
  border: none;
  color: white;
  border-radius: 4px;
`;

const Label = styled.label`
  width: 280px;
  display: flex;
  flex-direction: column;
  color: white;
  gap: 4px;

  &:focus-within {
    color: #80a1ef;
  }
`;

const InputTitle = styled.p`
  color: white;
  margin: 0;
`;

const GeneralInfo = styled.div``;

const InfoData = styled.p``;

const InfoValue = styled.span``;

const Button = styled.button<{ disabled?: boolean }>`
  height: 28px;
  background: #5461d8;
  border: none;
  color: white;
  border-radius: 4px;
`;

const FlexContainer = styled.div<{
  direction: 'row' | 'column';
  gap?: number;
  alignitems?: 'flex-start' | 'flex-end' | 'center';
  justifycontent?: 'flex-start' | 'flex-end' | 'center';
}>`
  width: fit-content;
  height: fit-content;
  display: flex;
  gap: ${({ gap }) => (gap ? `${gap}px` : 0)};
  flex-direction: ${({ direction }) => direction};
  align-items: ${({ alignitems }) => alignitems};
  justify-content: ${({ justifycontent }) => justifycontent};
`;

export const Styled = {
  Container,
  Header,
  Content,
  Input,
  Label,
  InputTitle,
  GeneralInfo,
  InfoData,
  InfoValue,
  Button,
  FlexContainer,
};
