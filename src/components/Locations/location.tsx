import * as React from 'react';
import { Header4 } from '../Typography/typography.styled';
import { Container, Background, Holder } from './location.styled';
import { Lock } from '../../images/ImagesExporter/ImageExporter';
import { EditLocation, DeleteLocation } from '../Buttons/buttons.styled';
import Distance from '../distance';
import { useNavigate } from 'react-router-dom';

type LocationProps = {
  id: string;
  image: string;
  distance?: number;
  isLocked?: boolean;
  isGuessed?: boolean;
  isMyLocation?: boolean;
  className?: string;
  onClick?: () => void;
};

const Location: React.FC<LocationProps> = (props: LocationProps) => {
  const navigate = useNavigate();
  const { id, image, isLocked, isGuessed, isMyLocation, className } = props;
  const { distance } = props;

  return (
    <Container
      image={image}
      onClick={() => {
        // Only navigate if the location is not locked and not owned by the user
        !isLocked && !isMyLocation && navigate(`../location/guess/${id}`);
      }}
      className={className ? className : ''}
    >
      {isMyLocation && (
        <EditLocation onClick={() => navigate(`../edit-location/${id}`)} />
      )}
      {isMyLocation && (
        <DeleteLocation onClick={() => navigate(`../delete-location/${id}`)} />
      )}

      <Background
        className={(isLocked || isGuessed) && !isMyLocation ? 'blured' : ''}
      />
      <Holder>
        {isLocked && !isMyLocation && (
          <img src={Lock} alt="lock" height="40px" width="30px" />
        )}
        {/* Provide a default of 0 if distance is undefined */}
        {isGuessed && !isLocked && <Header4>{Distance(distance ?? 0)}</Header4>}
      </Holder>
    </Container>
  );
};

export default Location;