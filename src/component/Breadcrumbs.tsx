import styled from 'styled-components';
import classNames from 'classnames';
import { Fragment } from 'react';


const BreadcrumbsContainer = styled.div`
  width: 100%;
  color: ${(props) => props.theme.color.onColor_2};

  &.hide{
    display: none;
    visibility: hidden;
  }
`;

const Crumb = styled.span`
  font-size: ${(props) => props.theme.typography.body2};
  text-transform: capitalize;

  &.link {
    &:hover,
    &:active {
      color: ${(props) => props.theme.color.onColor_1};
    }
    cursor: pointer;
  }
`;

type BreadcrumbsType = Array<{
  href?: string;
  content: string;
}>;

type BreadcrumbsProps = {
  breadcrumbs: BreadcrumbsType;
  onHrefUpdate?: (href: string) => void;
  className: string;
};

const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { breadcrumbs, onHrefUpdate, className } = props;

  const generateCrumbs = breadcrumbs.map((vale, index) => {
    const isLast = index === breadcrumbs.length - 1;
    const { href, content } = vale;
    return (
      <Fragment key={index}>
        <Crumb
          onClick={() => {
            if (href && onHrefUpdate) onHrefUpdate(href);
          }}
          className={classNames({ link: Boolean(href) })}
        >
          {content}
        </Crumb>
        {!isLast && ' / '}
      </Fragment>
    );
  });
  return <BreadcrumbsContainer className={className}>{generateCrumbs}</BreadcrumbsContainer>;
};

export default Breadcrumbs;


