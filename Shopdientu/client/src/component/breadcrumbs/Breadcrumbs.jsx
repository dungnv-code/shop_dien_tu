import styles from "./Breadcrumbs.module.css"
import useBreadcrumbs from "use-react-router-breadcrumbs"
import { Link } from "react-router-dom";

import clsx from "clsx";


const Breadcrumbs = ({ categori, title }) => {

    const routes = [
        { path: "/", breadcrumb: "Trang chủ" },
        { path: "/:categori", breadcrumb: categori },
        { path: "/:cid/:pid/:title", breadcrumb: title },
    ];
    const breadCrumbs = useBreadcrumbs(routes);
    // Lọc bỏ những breadcrumb có breadcrumb = null
    const visibleCrumbs = breadCrumbs.filter(bc => !bc.match.route === false);

    return (
        <nav>
            <ul className="d-flex gap-2 list-unstyled">
                {visibleCrumbs.map(({ match, breadcrumb }, index) => (
                    <li key={match.pathname} >
                        <Link className={clsx(styles.hover_bread)} to={match.pathname}>{breadcrumb}</Link>
                        {index < visibleCrumbs.length - 1 && " > "}
                    </li>
                ))}
            </ul>
        </nav>
    );
};


export default Breadcrumbs;