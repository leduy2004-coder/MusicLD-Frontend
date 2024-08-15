import PropTypes from 'prop-types';
import { useState, forwardRef } from 'react';
import classNames from 'classnames';
import images from '~/assets/images';
import styles from './Image.module.scss';

const Image = forwardRef(({ src, alt, className, fallback: customFallback = images.noImage, ...props }, ref) => {
    const [fallback, setFallback] = useState(customFallback);

    const handleError = () => {
        if (src !== fallback) {
            setFallback(customFallback);
        }
    };

    // Nếu src không hợp lệ, hiển thị fallback ngay từ đầu
    const imageSrc = src ? src : fallback;

    return (
        <img
            className={classNames(styles.wrapper, className)}
            ref={ref}
            src={imageSrc}
            alt={alt}
            {...props}
            onError={handleError}
        />
    );
});

Image.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
    fallback: PropTypes.string,
};

export default Image;
