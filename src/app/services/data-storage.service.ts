import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from './recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService implements OnInit {

  constructor(
    private http: HttpClient, 
    private recipeService: RecipeService,
    ) { }

  ngOnInit() {

  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put('https://fridge-recipe-782a6.firebaseio.com/recipes.json', 
      recipes
      ).subscribe(response => {
        console.log(response);
      })
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(
      'https://fridge-recipe-782a6.firebaseio.com/recipes.json',
    ).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []
          }
        });
      }), 
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    )
  }

}
