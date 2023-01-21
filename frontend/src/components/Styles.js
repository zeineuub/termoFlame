import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
export const CurrentDay = styled.View`
  position: relative;
  flex: 1;
  width: 100%;
  margin-top: 60px;
  align-items: center;
`;

export const City = styled.Text`
  font-size: 22px;
  font-weight: 300;
  color: white;
  padding-bottom: 20px;
`;
export const BigText = styled.Text`
  font-size: 35px;
  font-weight: 100;
  color: white;
  padding-bottom: 20px;
`;

export const BigIcon = styled.Image`
  width: 150px;
  height: 150px;
  padding-bottom: 40px;
`;

export const Temp = styled.Text`
  font-size: 65px;
  font-weight: 100;
  color: #bae8e8;
`;
export const Description = styled.Text`
  font-size: 24px;
  font-weight: 100;
  color: black;
  padding-top: 20px;
  margin-top:-10px;
`;

export const Week = styled.ScrollView`
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
  position: absolute;
  background: white;
`;

export const Day = styled.View`
  height: 150px;
  width: 75px;
  justify-content: center;
  align-items: center;
`;

export const SmallIcon = styled.Image`
  width: 50px;
  height: 50px;
`;
export const SmallText = styled.Text`
  font-size: 18px;
  font-weight: 300;
  color: #FF4E70;
`;
