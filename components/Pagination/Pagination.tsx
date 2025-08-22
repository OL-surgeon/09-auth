import React from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedPage: number) => void;
  currentPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  onPageChange,
  currentPage,
}) => {
  if (pageCount <= 1) return null;

  const handlePageChange = (event: { selected: number }) => {
    onPageChange(event.selected + 1);
  };

  return (
    <ReactPaginate
      previousLabel={"Prev"}
      nextLabel={"Next"}
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={handlePageChange}
      containerClassName={css.pagination}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.pageItem}
      nextClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextLinkClassName={css.pageLink}
    />
  );
};
