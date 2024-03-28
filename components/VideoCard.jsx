import style from "@styles/VideoCard.module.css";
import Image from "next/image";

export default function VideoCard({ thumbnail, title, description, duration }) {
  return (
    <div className={style.videoCard}>
      <div className={style.thumbnail}>
        <Image src={thumbnail} alt="Thumbnail" width={114} height={63} />
        {/* Can add duration tag on video card's thumbnail, when we would get the duration from the data*/}
        <span className={style.duration}>{duration}</span>
      </div>
      <div className={style.details}>
        <h3 className={style.title}>{title}</h3>
        <p className={style.description}>{description}</p>
      </div>
    </div>
  );
}
