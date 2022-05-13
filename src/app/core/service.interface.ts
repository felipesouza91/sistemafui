import {HttpParams} from '@angular/common/http';
import {Resultado} from './mode';
/**
 *Class form add a basic Service Methods
 *@param F Type of Filter Class
 *@param T Type of basic class for this service
 */
export interface BasicService<F, T> {
  /**
   * Find all values from back-end
   * @param filtro variable with filter options
   * @returns Return a promise conteins Resultado<T> interfacer;
   */
  findAll(filtro: F): Promise<Resultado<T>>;
  /**
   * Find all values from back-end
   * @param id Identified code form this search
   * @returns Return a promise conteins a value;
   */
  findById(id: number): Promise<T>;
  /**
   * Find all values from back-end
   * @param value Object for save in database
   * @returns Return a promise conteins a object saved representation;
   */
  save(value: T): Promise<T>;
  /**
   * Find all values from back-end
   * @param id Identified code form this update
   * @param value Object conteis update for save in database
   * @returns Return a promise conteins a object saved representation;
   */
  update(id: number, value: T): Promise<T>;
  /**
   * Find all values from back-end
   * @param id Identified code object is deleted
   * @returns Void;
   */
  delete(id: number): Promise<void>;

  createParams(filtro: F): HttpParams;
}
