import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Track.css';

class Track extends React.Component{
  constructor(props)
  {
    super(props);
    this.addTrack=this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
  }
  renderAction()
  {
    if(this.props.isRemoval === true)
      return (<span onClick={this.removeTrack}>-</span>);
    else {
      return (<span onClick={this.addTrack}>+</span>);
    }
}
addTrack(event) {
    this.props.onAdd(this.props.track);
}
removeTrack(track){
this.props.onRemove(this.props.track);
}
  render()
  {
    return(
      <div className="Track">
  <div className="Track-information">
    <h3>{this.props.track.Name}</h3>
    <p>{this.props.track.artist} | {this.props.track.Album}</p>
  </div>
  <a className="Track-action">{this.renderAction()}</a>
</div>
    )

    }

}

export default Track;
